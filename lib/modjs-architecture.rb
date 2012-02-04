module ModJS
  BASE_DIR = File.expand_path("../..", __FILE__)
  LIB_DIR = "#{BASE_DIR}/lib/modjs-architecture/lib"

  class Project < ArchitectureJS::Project
    # this line adds the default framework to ArchitectureJS
    ArchitectureJS::register_framework 'modjs', self

    def initialize(config, root = nil)
      raise "#{self.class}.new({ name: 'myapp' }, options): config[:name] is undefined" unless config[:name]

      @config = {
        framework: 'modjs',
        src_dir: 'modules',
        build_dir: 'application',
        dependencies: [],
        autoload: []
      }
      @config.merge! config unless config.nil?

      super(@config, root)
      @directories = %w'application elements lib models modules plugins spec'
    end

    def create
      super
      copy_modjs_core_to_lib
      copy_spec_files
      puts ArchitectureJS::Notification.added "#{@config[:build_dir]}/#{@config[:name]}.js created"
    end

    def get_file_name(module_path)
      module_file = module_path.split(/[\\\/]/).last
      module_filename = module_file.gsub(/\.module\.js$/, '')
    end

    def create_application_file
      app_file = "#{@root}/#{@config[:build_dir]}/#{@config[:name]}.js"
      FileUtils.cp "#{LIB_DIR}/mod.js", app_file
      File.open(app_file, 'a') { |f| f.write("\nvar #{@config[:name]} = new Mod.Application('#{@config[:name]}');") }
    end

    def copy_modjs_core_to_lib
      FileUtils.cp "#{LIB_DIR}/mod.js", "#{@root}/lib/"
    end

    def copy_spec_files
      FileUtils.mkdir "#{@root}/spec/jasmine"
      FileUtils.cp "#{ModJS::BASE_DIR}/spec/javascripts/application_spec.js", "#{@root}/spec/application_spec.js"
      FileUtils.cp "#{ModJS::BASE_DIR}/spec/javascripts/dom_spec.js", "#{@root}/spec/dom_spec.js"
      FileUtils.cp "#{ModJS::BASE_DIR}/spec/javascripts/existence_spec.js", "#{@root}/spec/existence_spec.js"
      FileUtils.cp "#{ModJS::BASE_DIR}/spec/javascripts/module_spec.js", "#{@root}/spec/module_spec.js"
      FileUtils.cp "#{ModJS::BASE_DIR}/lib/modjs-architecture/jasmine/jasmine-html.js", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::BASE_DIR}/lib/modjs-architecture/jasmine/jasmine.css", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::BASE_DIR}/lib/modjs-architecture/jasmine/jasmine.js", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::BASE_DIR}/lib/modjs-architecture/jasmine/jasmine_favicon.png", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::BASE_DIR}/lib/modjs-architecture/jasmine/MIT.LICENSE", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::BASE_DIR}/lib/modjs-architecture/jasmine/index.html", "#{@root}/spec/jasmine/"
    end

    def update
      read_config
      update_application_file
      super
    end

    def update_application_file
      app_file = "#{@root}/#{@config[:build_dir]}/#{@config[:name]}.js"

      File.open(app_file, "w+") do |file|
        write_dependencies(file)
        write_core(file)
        write_autoload(file)
      end

      ArchitectureJS::Notification.log "#{app_file} updated"
      compile_application_file app_file
    end

    def write_dependencies(file)
      if @config[:dependencies]
        @config[:dependencies].each do |dependency|
          file << "/*---------- ModJS dependency #{dependency} ----------*/\n"
          file << "//= require #{dependency}\n\n" if dependency.match(/^\<.+\>$/)
          file << "//= require \"#{dependency}\"\n\n" if dependency.match(/^[^\<].+|[^\>]$/)
        end
      end
    end
    
    def write_core(file)
      file << "/*---------- ModJS ../lib/mod.js ----------*/\n"
      file << "//= require \"../lib/mod.js\"\n\n"
      file << "var #{@config[:name]} = new Mod.Application('#{@config[:name]}');\n\n"
    end
    
    def write_autoload(file)
      if @config[:autoload]
        @config[:autoload].each do |autoload|
          file << "/*---------- ModJS autoload #{autoload} ----------*/\n"
          file << "//= require #{autoload}\n\n" if autoload.match(/^\<.+\>$/)
          file << "//= require \"#{autoload}\"\n\n" if autoload.match(/^[^\<].+|[^\>]$/)
        end
      end
    end

    def compile_application_file(file)
      sprockets = Sprockets::Secretary.new(
        root: ModJS::BASE_DIR,
        asset_root: File.expand_path(@config[:asset_root], @root),
        load_path: ['repository'],
        source_files: [file]
      )

      application_file = sprockets.concatenation
      application_file.save_to file
      sprockets.install_assets
    rescue Exception => error
      @errors = true
      puts ModJS::Notification.error "Sprockets error: #{error.message}"
    end
  end # class Project
end # module ArchitectureJS
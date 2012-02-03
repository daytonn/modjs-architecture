module ModJS
  BASE_DIR = File.expand_path("../", __FILE__)
  LIB_DIR = "#{BASE_DIR}/modjs-architecture/lib"

  class Project < ArchitectureJS::Project
    # this line adds the default framework to ArchitectureJS
    ArchitectureJS::register_framework 'modjs', self

    def initialize(config, root = nil)
      raise "#{self.class}.new({ name: 'myapp' }, options): config[:name] is undefined" unless config[:name]

      @config = {
        framework: 'modjs',
        src_dir: 'modules',
        build_dir: 'application'
      }
      @config.merge! config unless config.nil?

      super(@config, root)
      @secretary = Sprockets::Secretary.new(
        :root         => "#{ModJS::BASE_DIR}",
        :asset_root   => File.expand_path(@config[:asset_root], @root),
        :load_path    => ["repository"]
      )
      @directories = %w'application elements lib models modules plugins spec'
    end

    def create
      super
      copy_modjs_core_to_lib
      copy_spec_files
      puts ArchitectureJS::Notification.added "#{@config[:build_dir]}/#{@config[:name]}.js created"
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
      update_application_file
      super
    end

    def update_application_file
      #TODO @config[:dependencies] and @config[:autoload]
      app_file = "#{@root}/#{@config[:build_dir]}/#{@config[:name]}.js"
      @secretary[:src_files] << "#{@root}/lib/mod.js"
      compiled_file = @secretary[:src_files].concatenation
      compiled_file.save_to app_file
      File.open(app_file, 'a') { |f| f.write("\nvar #{@config[:name]} = new Mod.Application('#{@config[:name]}');") }
      ArchitectureJS::Notification.log "#{app_file} updated"
    end
  end # class Project
end # module ArchitectureJS
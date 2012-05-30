require 'EJS'

module ArchitectureJS
  class Generator
    def generate_file(filename, template, path = nil)
      path ||= File.expand_path(Dir.getwd)
      filename = filename.gsub(/\.js$/, '.module.js')
      File.open("#{path}/#{filename}", "w+") { |f| f.write template }
      puts ArchitectureJS::Notification.added "#{filename} added" if File.exists?("#{path}/#{filename}")
    end
  end
end

module ModJS

  def base_dir
    File.expand_path("../..", __FILE__)
  end

  def lib_dir
    "#{ModJS::base_dir}/lib/modjs-architecture/lib"
  end

  module_function :base_dir, :lib_dir

  class Blueprint < ArchitectureJS::Blueprint
    # this line adds the framework to ArchitectureJS
    ArchitectureJS::register_blueprint 'modjs', self

    def initialize(config, root = nil)
      @config = {
        blueprint: 'modjs',
        src_dir: 'modules',
        build_dir: 'application',
        dependencies: [],
        autoload: []
      }
      @config.merge! config unless config.nil?

      super(@config, root)

      add_templates "#{ModJS::base_dir}/templates"
      @directories = %w'application elements lib models modules plugins spec templates'
    end

    def create
      super
      copy_modjs_core_to_lib
      copy_spec_files
      puts ArchitectureJS::Notification.added "#{@config[:build_dir]}/#{@config[:name].downcase}.js created"
    end

    def get_file_name(module_path)
      module_file = module_path.split(/[\\\/]/).last

      module_filename = module_file.gsub(/\.module\.js$/, '') if module_file.match /\.module\.js$/
      module_filename = module_file.gsub(/\.js$/, '')
    end

    def create_application_file
      app_file = "#{@root}/#{@config[:build_dir]}/#{@config[:name].downcase}.js"
      FileUtils.cp "#{ModJS::lib_dir}/mod.js", app_file
      File.open(app_file, 'a') { |f| f.write("\nvar #{@config[:name]} = new Mod.Application('#{@config[:name]}');") }
    end

    def copy_modjs_core_to_lib
      FileUtils.cp "#{ModJS::lib_dir}/mod.js", "#{@root}/lib/"
    end

    def copy_spec_files
      FileUtils.mkdir "#{@root}/spec/jasmine"
      FileUtils.cp "#{ModJS::base_dir}/spec/javascripts/application_spec.js", "#{@root}/spec/application_spec.js"
      FileUtils.cp "#{ModJS::base_dir}/spec/javascripts/dom_spec.js", "#{@root}/spec/dom_spec.js"
      FileUtils.cp "#{ModJS::base_dir}/spec/javascripts/existence_spec.js", "#{@root}/spec/existence_spec.js"
      FileUtils.cp "#{ModJS::base_dir}/spec/javascripts/module_spec.js", "#{@root}/spec/module_spec.js"
      FileUtils.cp "#{ModJS::base_dir}/lib/modjs-architecture/jasmine/jasmine-html.js", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::base_dir}/lib/modjs-architecture/jasmine/jasmine.css", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::base_dir}/lib/modjs-architecture/jasmine/jasmine.js", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::base_dir}/lib/modjs-architecture/jasmine/jasmine_favicon.png", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::base_dir}/lib/modjs-architecture/jasmine/MIT.LICENSE", "#{@root}/spec/jasmine/"
      FileUtils.cp "#{ModJS::base_dir}/lib/modjs-architecture/jasmine/index.html", "#{@root}/spec/jasmine/"
    end

    def update(compress = false)
      read_config
      update_application_file
      compile_templates
      super(compress)
    end

    def compile_src_files
      @src_files.each do |file_path|
        file_name = get_file_name file_path.gsub(/\.module\.js$/, '.js')
        compile_src_file file_path, file_name
      end
    end

    def update_application_file
      app_file = "#{@root}/#{@config[:build_dir]}/#{@config[:name].downcase}.js"

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
        root: ModJS::base_dir,
        asset_root: File.expand_path(@config[:asset_root], @root),
        load_path: ['repository'],
        source_files: [file],
        interpolate_constants: false
      )

      application_file = sprockets.concatenation
      application_file.save_to file
      sprockets.install_assets
    rescue Exception => error
      @errors = true
      puts ArchitectureJS::Notification.error "Sprockets error: #{error.message}"
    end

    def compile_templates
      app_name = @config[:name]
      compiled_templates = fetch_templates
      formatted_templates = format_templates(compiled_templates)
      template = ERB.new File.read("#{ModJS::base_dir}/lib/modjs-architecture/templates/templates.erb.js")

      File.open("#{@root}/#{@config[:build_dir]}/templates.js", "w+") do |f|
        f << template.result(binding)
      end
    end

    def fetch_templates
      templates = {}
      Dir.glob("#{@root}/templates/**/*.jst").each do |template|
        name = File.basename(template).gsub(/\.jst$/, '')
        templates[name] = EJS.compile(File.read(template))
      end
      templates
    end

    def format_templates(compiled_templates)
      formatted_templates = compiled_templates.map do |name, function|
        "\"#{name}\": #{function}"
      end
    end

  end # class Project
end # module ArchitectureJS
module ModJS
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

      super(config, root)

      @directories = %w'application elements lib models modules plugins spec'
    end

    def create
      super
      # do modjs stuff
    end

    def copy_modjs_core_to_lib
      
    end

  end # class Project
end # module ArchitectureJS
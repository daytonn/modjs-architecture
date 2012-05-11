# Generated by jeweler
# DO NOT EDIT THIS FILE DIRECTLY
# Instead, edit Jeweler::Tasks in Rakefile, and run 'rake gemspec'
# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "modjs-architecture"
  s.version = "0.4.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Dayton Nolan"]
  s.date = "2012-05-11"
  s.description = "Mod.js is a modular javascript library that provides a base application strucure to build large javascript applications. Mod.js is designed to work with architecture.js."
  s.email = "daytonn@gmail.com"
  s.extra_rdoc_files = [
    "LICENSE.txt",
    "README.md"
  ]
  s.files = [
    ".document",
    ".rspec",
    ".rvmrc",
    ".travis.yml",
    "Gemfile",
    "LICENSE.txt",
    "README.md",
    "Rakefile",
    "VERSION",
    "docs/application.html",
    "docs/docco.css",
    "docs/dom.html",
    "docs/events.html",
    "docs/existence.html",
    "docs/module.html",
    "lib/modjs-architecture.rb",
    "lib/modjs-architecture/core/application.js",
    "lib/modjs-architecture/core/dom.js",
    "lib/modjs-architecture/core/module.js",
    "lib/modjs-architecture/extensions/events.js",
    "lib/modjs-architecture/helpers/existence.js",
    "lib/modjs-architecture/jasmine/MIT.LICENSE",
    "lib/modjs-architecture/jasmine/index.html",
    "lib/modjs-architecture/jasmine/jasmine-html.js",
    "lib/modjs-architecture/jasmine/jasmine.css",
    "lib/modjs-architecture/jasmine/jasmine.js",
    "lib/modjs-architecture/jasmine/jasmine_favicon.png",
    "lib/modjs-architecture/lib/mod.js",
    "lib/modjs-architecture/modjs.architecture",
    "lib/modjs-architecture/modjs.blueprint",
    "lib/modjs-architecture/src/mod.js",
    "modjs-architecture.gemspec",
    "spec/fixtures/foo-elements.js",
    "spec/fixtures/foo.js",
    "spec/fixtures/foo_all.js",
    "spec/fixtures/foo_elements.js",
    "spec/fixtures/foo_model.js",
    "spec/fixtures/model_name.js",
    "spec/fixtures/myapp.architecture",
    "spec/fixtures/myapp.blueprint",
    "spec/fixtures/myapp.js",
    "spec/fixtures/test.js",
    "spec/fixtures/test.module.js",
    "spec/fixtures/update.architecture",
    "spec/fixtures/update.blueprint",
    "spec/fixtures/update.js",
    "spec/javascripts/application_spec.js",
    "spec/javascripts/dom_spec.js",
    "spec/javascripts/existence_spec.js",
    "spec/javascripts/module_spec.js",
    "spec/javascripts/support/jasmine.css",
    "spec/javascripts/support/jasmine.yml",
    "spec/javascripts/support/jasmine_config.rb",
    "spec/javascripts/support/jasmine_runner.rb",
    "spec/modjs-architecture_spec.rb",
    "spec/spec_helper.rb",
    "spec/templates_spec.rb",
    "templates/model.js",
    "templates/module.js"
  ]
  s.homepage = "http://github.com/daytonn/modjs-architecture"
  s.licenses = ["MIT"]
  s.require_paths = ["lib"]
  s.rubygems_version = "1.8.21"
  s.summary = "Mod.js is an a la carte javascript framework"

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<architecture-js>, [">= 0"])
      s.add_development_dependency(%q<rspec>, [">= 0"])
      s.add_development_dependency(%q<bundler>, [">= 0"])
      s.add_development_dependency(%q<jeweler>, ["~> 1.8.3"])
      s.add_development_dependency(%q<jasmine>, [">= 0"])
      s.add_runtime_dependency(%q<architecture-js>, [">= 0"])
    else
      s.add_dependency(%q<architecture-js>, [">= 0"])
      s.add_dependency(%q<rspec>, [">= 0"])
      s.add_dependency(%q<bundler>, [">= 0"])
      s.add_dependency(%q<jeweler>, ["~> 1.8.3"])
      s.add_dependency(%q<jasmine>, [">= 0"])
      s.add_dependency(%q<architecture-js>, [">= 0"])
    end
  else
    s.add_dependency(%q<architecture-js>, [">= 0"])
    s.add_dependency(%q<rspec>, [">= 0"])
    s.add_dependency(%q<bundler>, [">= 0"])
    s.add_dependency(%q<jeweler>, ["~> 1.8.3"])
    s.add_dependency(%q<jasmine>, [">= 0"])
    s.add_dependency(%q<architecture-js>, [">= 0"])
  end
end


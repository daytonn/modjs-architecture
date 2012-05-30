require "spec_helper.rb"

describe ModJS::Blueprint do

  describe "defaults" do

    before :each do
      suppress_output { @project = ModJS::Blueprint.new( { name: 'myapp' }, TMP_DIR) }
    end

    it 'should have a base_dir' do
      ModJS::base_dir.should == MODJS_ROOT
    end
    
    it 'should have the correct directories' do
      @project.directories.should == %w'application elements lib models modules plugins spec templates'
    end
  end

  describe 'project creation' do
    before :each do
      suppress_output do
        @project = ModJS::Blueprint.new( { name: 'myapp' }, TMP_DIR)
        @project.create
      end
    end

    after :each do
      FileUtils.rm_rf(TMP_DIR)
    end

    it 'should create the modjs directories' do
      File.exists?("#{TMP_DIR}/application").should be_true
      File.exists?("#{TMP_DIR}/elements").should be_true
      File.exists?("#{TMP_DIR}/lib").should be_true
      File.exists?("#{TMP_DIR}/models").should be_true
      File.exists?("#{TMP_DIR}/modules").should be_true
      File.exists?("#{TMP_DIR}/plugins").should be_true
      File.exists?("#{TMP_DIR}/spec").should be_true
      File.exists?("#{TMP_DIR}/templates").should be_true
    end

    it 'should create the blueprint file' do
      File.exists?("#{TMP_DIR}/myapp.blueprint").should be_true
    end

    it 'should create an application file in the build_dir' do
      File.exists?("#{TMP_DIR}/application/myapp.js").should be_true
    end

    it 'should copy the core library into the lib folder' do
      File.exists?("#{TMP_DIR}/lib/mod.js").should be_true
    end

    it 'should copy the jasmine tests into the spec folder' do
      File.exists?("#{TMP_DIR}/spec/application_spec.js").should be_true
      File.exists?("#{TMP_DIR}/spec/dom_spec.js").should be_true
      File.exists?("#{TMP_DIR}/spec/existence_spec.js").should be_true
      File.exists?("#{TMP_DIR}/spec/module_spec.js").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine").should be_true
      
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine-html.js").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine.css").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine.js").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine_favicon.png").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/MIT.LICENSE").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/index.html").should be_true
    end
  end

  describe 'project update' do
  
    before :each do
      suppress_output do
        @project = ModJS::Blueprint.new( { name: 'myapp' }, TMP_DIR)
        @project.create
      end

      FileUtils.rm_rf "#{TMP_DIR}/myapp.blueprint"
      FileUtils.cp "#{FIXTURES}/update.blueprint", "#{TMP_DIR}/myapp.blueprint"
      FileUtils.cp "#{FIXTURES}/test.module.js", "#{TMP_DIR}/modules/test.module.js"
      FileUtils.cp "#{FIXTURES}/test2.module.js", "#{TMP_DIR}/modules/test2.module.js"
      FileUtils.cp "#{FIXTURES}/test.jst",  "#{TMP_DIR}/templates/test.jst"
      FileUtils.cp "#{FIXTURES}/test_two.jst",  "#{TMP_DIR}/templates/test_two.jst"
      suppress_output do
        @project.update
      end
    end

    after :each do
      FileUtils.rm_rf(TMP_DIR)
    end

    it 'should compile the application file' do
      puts TMP_DIR
      File.exists?("#{TMP_DIR}/application/myapp.js").should be_true
    end

    it 'should compile the test module' do
      File.exists?("#{TMP_DIR}/application/test.js").should be_true
    end

    it 'should compile .jst files into application/templates.js' do
      File.exists?("#{TMP_DIR}/application/templates.js").should be_true
      "#{TMP_DIR}/application/templates.js".should be_same_file_as "#{FIXTURES}/templates_compiled.js"
    end

  end

end

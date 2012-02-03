require "spec_helper.rb"

describe ModJS::Project do

  describe "defaults" do

    before :each do
      suppress_output { @project = ModJS::Project.new( { name: 'myapp' }, TMP_DIR) }
    end

    it 'should have a BASE_DIR constant' do
      ModJS::BASE_DIR = MODJS_ROOT
    end
    
    it 'should have the correct directories' do
      @project.directories.should == %w'application elements lib models modules plugins spec'
    end
  end

  describe 'project creation' do
    before :each do
      suppress_output do
        @project = ModJS::Project.new( { name: 'myapp' }, TMP_DIR)
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
    end

    it 'should create an application file in the build_dir' do
      "#{TMP_DIR}/application/myapp.js".should be_same_file_as "#{FIXTURES}/myapp.js"
    end

    it 'should copy the core library into the lib folder' do
      "#{TMP_DIR}/lib/mod.js".should be_same_file_as "#{ModJS::LIB_DIR}/mod.js"
    end

    it 'should copy the jasmine tests into the spec folder' do
      "#{TMP_DIR}/spec/application_spec.js".should be_same_file_as "#{SPEC_DIR}/javascripts/application_spec.js"
      "#{TMP_DIR}/spec/dom_spec.js".should be_same_file_as "#{SPEC_DIR}/javascripts/dom_spec.js"
      "#{TMP_DIR}/spec/existence_spec.js".should be_same_file_as "#{SPEC_DIR}/javascripts/existence_spec.js"
      "#{TMP_DIR}/spec/module_spec.js".should be_same_file_as "#{SPEC_DIR}/javascripts/module_spec.js"
      File.exists?("#{TMP_DIR}/spec/jasmine").should be_true
      
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine-html.js").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine.css").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine.js").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/jasmine_favicon.png").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/MIT.LICENSE").should be_true
      File.exists?("#{TMP_DIR}/spec/jasmine/index.html").should be_true
    end
  end

end

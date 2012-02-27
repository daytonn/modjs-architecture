require "spec_helper.rb"

describe "ModJS templates" do

  before :each do
    suppress_output do
      @project = ModJS::Blueprint.new( { name: 'myapp' }, TMP_DIR)
      @project.create
      FileUtils.cd("#{TMP_DIR}")
    end
  end

  after :each do
    FileUtils.rm_rf(TMP_DIR)
    FileUtils.cd(SPEC_DIR)
  end

  it 'should generate a module file' do
    config = {
      arguments: ['module', 'foo'],
      template: 'module',
      filename: 'foo',
      options: {}
    }

    @project.generator.generate(config)
    File.exists?("#{TMP_DIR}/foo.js").should be_true
    "#{TMP_DIR}/foo.js".should be_same_file_as "#{FIXTURES}/foo.js"
  end

  it 'should render a module with elements' do
    config = {
      arguments: ['module', 'foo_elements', '-e'],
      template: 'module',
      filename: 'foo_elements',
      options: { e: true }
    }

    @project.generator.generate(config)
    File.exists?("#{TMP_DIR}/foo_elements.js").should be_true
    "#{TMP_DIR}/foo_elements.js".should be_same_file_as "#{FIXTURES}/foo_elements.js"
  end

  it 'should render a module with a model' do
    config = {
      arguments: ['module', 'foo_model', '-m'],
      template: 'module',
      filename: 'foo_model',
      options: { m: true }
    }

    @project.generator.generate(config)
    File.exists?("#{TMP_DIR}/foo_model.js").should be_true
    "#{TMP_DIR}/foo_model.js".should be_same_file_as "#{FIXTURES}/foo_model.js"
  end

  it 'should render a module with both a model and elements' do
    config = {
      arguments: ['module', 'foo_all', '-e', '-m'],
      template: 'module',
      filename: 'foo_all',
      options: { e: true, m: true }
    }

    @project.generator.generate(config)
    File.exists?("#{TMP_DIR}/foo_all.js").should be_true
    "#{TMP_DIR}/foo_all.js".should be_same_file_as "#{FIXTURES}/foo_all.js"
  end

end
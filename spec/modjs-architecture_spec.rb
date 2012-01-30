require "spec_helper.rb"

describe ModJS::Project do

  before :each do
    @project = ModJS::Project.new( { name: 'myapp' }, TMP_DIR)
  end

  it 'should have the correct directories' do
    @project.directories.should == %w'application elements lib models modules plugins spec'
  end

end

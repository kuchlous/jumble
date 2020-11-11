class AddExampleToWord < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :example, :string
  end
end

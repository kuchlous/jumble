class AddClassToWords < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :grade, :integer
  end
end

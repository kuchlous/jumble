class AddMeaningToWord < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :meaning, :string
  end
end
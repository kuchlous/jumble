class AddMisspellingsToWord < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :misspellings, :string
  end
end

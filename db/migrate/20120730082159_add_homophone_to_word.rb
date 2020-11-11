class AddHomophoneToWord < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :homophone, :string
  end
end

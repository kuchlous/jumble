class RemoveMeaningFromWord < ActiveRecord::Migration[5.2]
  def change
    remove_column :words, :meaning
  end
end

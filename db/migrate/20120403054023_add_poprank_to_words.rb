class AddPoprankToWords < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :pop_rank, :integer
  end
end

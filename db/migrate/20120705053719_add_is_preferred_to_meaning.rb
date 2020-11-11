class AddIsPreferredToMeaning < ActiveRecord::Migration[5.2]
  def change
    add_column :meanings, :is_preferred, :boolean, :default => 0
  end
end

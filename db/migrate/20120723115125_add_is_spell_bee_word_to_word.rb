class AddIsSpellBeeWordToWord < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :is_spell_bee, :boolean
  end
end

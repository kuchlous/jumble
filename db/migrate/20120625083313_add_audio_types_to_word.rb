class AddAudioTypesToWord < ActiveRecord::Migration[5.2]
  def change
    add_column :words, :audio_types, :string
  end
end

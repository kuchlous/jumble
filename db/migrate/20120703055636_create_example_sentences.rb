class CreateExampleSentences < ActiveRecord::Migration[5.2]
  def change
    create_table :example_sentences do |t|
      t.integer :tatoeba_id
      t.string  :text
      t.boolean :has_audio

      t.timestamps
    end
  end
end

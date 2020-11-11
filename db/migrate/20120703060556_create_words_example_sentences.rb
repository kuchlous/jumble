class CreateWordsExampleSentences < ActiveRecord::Migration[5.2]
  def up
    create_table :example_sentences_words, :id => false do |t|
      t.references :word, :example_sentence
    end
  end

  def down
    drop_table :example_sentences_words 
  end
end

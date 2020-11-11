class WordExampleSentence < ActiveRecord::Base
  belongs_to :word
  belongs_to :example_sentence
end


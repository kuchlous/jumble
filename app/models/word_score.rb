class WordScore < ActiveRecord::Base
  belongs_to :word
  belongs_to :user
end


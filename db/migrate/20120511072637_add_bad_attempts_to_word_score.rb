class AddBadAttemptsToWordScore < ActiveRecord::Migration[5.2]
  def change
    add_column :word_scores, :bad_attempts, :string
  end
end

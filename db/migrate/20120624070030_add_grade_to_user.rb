class AddGradeToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :grade_id, :integer
  end
end

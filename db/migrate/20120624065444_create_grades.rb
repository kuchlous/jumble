class CreateGrades < ActiveRecord::Migration[5.2]
  def change
    create_table :grades do |t|
      t.integer :year
      t.string :section
      t.references :school

      t.timestamps
    end
  end
end

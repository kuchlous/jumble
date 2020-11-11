# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :grade do
    year 1
    section "MyString"
    school_id 1
  end
end

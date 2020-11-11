require "spec_helper"

describe GradeWeekWordsController do
  describe "routing" do

    it "routes to #index" do
      get("/grade_week_words").should route_to("grade_week_words#index")
    end

    it "routes to #new" do
      get("/grade_week_words/new").should route_to("grade_week_words#new")
    end

    it "routes to #show" do
      get("/grade_week_words/1").should route_to("grade_week_words#show", :id => "1")
    end

    it "routes to #edit" do
      get("/grade_week_words/1/edit").should route_to("grade_week_words#edit", :id => "1")
    end

    it "routes to #create" do
      post("/grade_week_words").should route_to("grade_week_words#create")
    end

    it "routes to #update" do
      put("/grade_week_words/1").should route_to("grade_week_words#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/grade_week_words/1").should route_to("grade_week_words#destroy", :id => "1")
    end

  end
end

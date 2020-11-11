require "spec_helper"

describe SessionScoresController do
  describe "routing" do

    it "routes to #index" do
      get("/session_scores").should route_to("session_scores#index")
    end

    it "routes to #new" do
      get("/session_scores/new").should route_to("session_scores#new")
    end

    it "routes to #show" do
      get("/session_scores/1").should route_to("session_scores#show", :id => "1")
    end

    it "routes to #edit" do
      get("/session_scores/1/edit").should route_to("session_scores#edit", :id => "1")
    end

    it "routes to #create" do
      post("/session_scores").should route_to("session_scores#create")
    end

    it "routes to #update" do
      put("/session_scores/1").should route_to("session_scores#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/session_scores/1").should route_to("session_scores#destroy", :id => "1")
    end

  end
end

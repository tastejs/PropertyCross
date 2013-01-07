require 'rho/rhocontroller'
require 'helpers/browser_helper'

class PropertyCrossController < Rho::RhoController
  include BrowserHelper

  # GET /PropertyCross
  def index
    @propertycrosses = PropertyCross.find(:all)
    render :back => '/app'
  end

  # GET /PropertyCross/{1}
  def show
    @propertycross = PropertyCross.find(@params['id'])
    if @propertycross
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /PropertyCross/new
  def new
    @propertycross = PropertyCross.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /PropertyCross/{1}/edit
  def edit
    @propertycross = PropertyCross.find(@params['id'])
    if @propertycross
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /PropertyCross/create
  def create
    @propertycross = PropertyCross.create(@params['propertycross'])
    redirect :action => :index
  end

  # POST /PropertyCross/{1}/update
  def update
    @propertycross = PropertyCross.find(@params['id'])
    @propertycross.update_attributes(@params['propertycross']) if @propertycross
    redirect :action => :index
  end

  # POST /PropertyCross/{1}/delete
  def delete
    @propertycross = PropertyCross.find(@params['id'])
    @propertycross.destroy if @propertycross
    redirect :action => :index  
  end
end

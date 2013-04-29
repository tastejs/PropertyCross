package com.propertycross.mgwt.locations;

public final class Search {

	private final String displayText;
	private final String searchText;
	private final int numberProperties;

	public Search(String displayText, String searchText, int numberProperties) {
		this.displayText = displayText;
		this.searchText = searchText;
		this.numberProperties = numberProperties;
	}

	public String displayText() {
		return displayText;
	}

	public String searchText() {
		return searchText;
	}

	public int numberProperties() {
		return numberProperties;
	}

	@Override
  public int hashCode() {
	  final int prime = 31;
	  int result = 1;
	  result = prime * result + ((searchText == null) ? 0 : searchText.hashCode());
	  return result;
  }
	
	@Override
  public boolean equals(Object obj) {
	  if (this == obj)
		  return true;
	  if (obj == null)
		  return false;
	  if (getClass() != obj.getClass())
		  return false;
	  Search other = (Search) obj;
	  if (searchText == null) {
		  if (other.searchText != null)
			  return false;
	  } else if (!searchText.equals(other.searchText))
		  return false;
	  return true;
  }

	

}

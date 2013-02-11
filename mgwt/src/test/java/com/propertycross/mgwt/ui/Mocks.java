package com.propertycross.mgwt.ui;

import com.google.gwt.testing.easygwtmock.client.MocksControl;
import com.google.gwt.user.client.ui.HasValue;
import com.propertycross.mgwt.locations.SearchesManager;

interface Mocks extends MocksControl {

    SearchesManager searchesManager();
    HasValue<String> hasStringValue();

}

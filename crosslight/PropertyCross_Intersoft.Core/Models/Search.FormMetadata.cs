using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Forms;
using PropertyCross_Intersoft.ViewModels;

namespace PropertyCross_Intersoft.Models
{
    [FormMetadataType(typeof(Search.FormMetadata))]
    partial class Search
    {
        [Form(Title = "Property Search")]
        public class FormMetadata
        {
            [Section]
            public static SearchDetailSection SearchDetail;

            [Section("Recent Search")]
            public static SearchHistorySection SearchHistory;
        }
        
        public class SearchDetailSection
        {
            [Editor(EditorType.Label)]
            [Display(MaxNumberOfLines = 0, Caption = "Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My Location' to search in your current location")]
            public static string Info;

            [Editor(EditorType.TextField)]
            [Layout(Style = LayoutStyle.DetailOnly)]
            [StringInput(Placeholder = "Enter a location, i.e., Brighton")]
            public static string Location;

            [Editor(EditorType.Button)]
            [Display(Caption = "Go")]
            [Binding(Path = "SearchCommand", SourceType = BindingSourceType.ViewModel)]
            [Button(TintColorMode = TintColorMode.TextColor)]
            public static string SearchPropertyButton;

            [Editor(EditorType.Button)]
            [Display(Caption = "My Location")]
            [Binding(Path = "SearchMyLocationCommand", SourceType = BindingSourceType.ViewModel)]
            [Button(TintColorMode = TintColorMode.TextColor)]
            public static string SearchPropertyFromMyLocationButton;
        }

        public class SearchHistorySection
        {
            [Editor(EditorType.ListView)]
            [ListView(Style = ListViewCellStyle.RightDetail, DisplayMemberPath = "Recent", DetailMemberPath = "TotalResult", InteractionMode = ListViewInteractionMode.Navigation)]
            [Layout(Style = LayoutStyle.DetailOnly)]
            [NavigateAction(typeof(PropertyListViewModel))]
            [SelectionInput(SelectionMode.Single)]
            public static ObservableCollection<RecentSearch> RecentSearches;
        }
    }
}
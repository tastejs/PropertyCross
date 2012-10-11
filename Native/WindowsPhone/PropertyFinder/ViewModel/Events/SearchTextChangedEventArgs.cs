using System;

namespace PropertyFinder.ViewModel
{
  public class SearchTextChangedEventArgs : EventArgs
  {
    public string Text { get; private set; }

    public SearchTextChangedEventArgs(string text)
    {
      Text = text;
    }
  }
}

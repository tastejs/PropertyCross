using Newtonsoft.Json.Linq;

namespace PropertyCross.Model
{
  public static class Util
  {
    public static int? ToNullableInt(this JToken token, string propertyName)
    {
      string value = (string)token[propertyName];
      return string.IsNullOrEmpty(value) ? (int?)null : int.Parse(value);
    }
  }
}

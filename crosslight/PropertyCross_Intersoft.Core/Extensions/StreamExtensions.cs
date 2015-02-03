using System.IO;

namespace PropertyCross_Intersoft
{
    public static class StreamExtensions
    {
        #region Static Methods

        public static byte[] ToByte(this Stream input)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                input.CopyTo(ms);
                return ms.ToArray();
            }
        }

        #endregion
    }
}
using System.Text;

public class BufferHelper {


    public static byte[] TextToByte(string Text) => Encoding.ASCII.GetBytes(Text);
}
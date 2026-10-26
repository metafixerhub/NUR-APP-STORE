$definition = @'
using System;
using System.Runtime.InteropServices;
public class WinINetNotify {
    [DllImport("wininet.dll", SetLastError = true)]
    public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int dwBufferLength);
    public static void Refresh() {
        InternetSetOption(IntPtr.Zero, 39, IntPtr.Zero, 0);
        InternetSetOption(IntPtr.Zero, 37, IntPtr.Zero, 0);
    }
}
'@
Add-Type -TypeDefinition $definition
[WinINetNotify]::Refresh()
Write-Output "Proxy refresh broadcast complete"

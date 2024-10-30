using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Icons
{
    public interface IFaviconService
    {
        Task<string> DownloadFaviconAsync(string url);
    }
}

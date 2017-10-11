using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.UI.WebControls;

namespace EleditorBackendDemo.Controllers
{
    public class ImageUploadController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }
        

        static readonly string ServerUploadFolder = Path.GetTempPath();

        [HttpPost]
        public async Task<HttpResponseMessage> UploadFile()
        { 
            // Verify that this is an HTML Form file upload request
            if (!Request.Content.IsMimeMultipartContent("form-data"))
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.UnsupportedMediaType));
            }

            string path=HttpContext.Current.Server.MapPath("~/tmp/");
            // Create a stream provider for setting up output streams
            var  streamProvider = new MyMultipartFormDataStreamProvider(path);
            

            // Read the MIME multipart asynchronously content using the stream provider we just created.
            await Request.Content.ReadAsMultipartAsync(streamProvider);

            var url=HttpContext.Current.Request.Url;
            var str=url.Scheme+"://"+url.Authority+"/tmp/";
            string responseText = streamProvider.FileData[0].LocalFileName.Replace(path, str);

            var response = Request.CreateResponse(HttpStatusCode.OK, responseText);

            // Create response
            return response;
        }

        private class MyMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
        {
            public MyMultipartFormDataStreamProvider(string rootPath) : base(rootPath)
            {
            }
            

            public override string GetLocalFileName(HttpContentHeaders headers)
            {
                string originalFileName = headers.ContentDisposition.FileName.Trim('\"');

                return originalFileName;
            }
        }


        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}
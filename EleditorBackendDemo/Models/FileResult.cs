using System.Collections.Generic;

namespace EleditorBackendDemo
{
    /// <summary>
    /// This class is used to carry the result of various file uploads.
    /// </summary>
    public class FileResult
    {
        /// <summary>
        /// Gets or sets the local path of the file saved on the server.
        /// </summary>
        /// <value>
        /// The local path.
        /// </value>
        public IEnumerable<string> FileNames { get; set; }
        public string FileName { get; set;}

        /// <summary>
        /// Gets or sets the submitter as indicated in the HTML form used to upload the data.
        /// </summary>
        /// <value>
        /// The submitter.
        /// </value>
        public string Submitter { get; set; }
    }
}

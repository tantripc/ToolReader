using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;

namespace OauthAPI
{
    public class APIResJsonConnect
    {
        private string _rootUrlApi;
        private string _clientIdApi;
        private string _clientSecretApi;
        public APIResJsonConnect(string rootUrlApi, string clientIdApi = "", string clientSecretApi = "")
        {
            _rootUrlApi = rootUrlApi;
            _clientIdApi = clientIdApi;
            _clientSecretApi = clientSecretApi;
        }

        private string convertUrl(string Controller, string Action, Dictionary<string, object> Params)
        {
            if (Params != null)
            {
                if (string.IsNullOrEmpty(Action))
                {
                    return string.Join('/', new string[] { "api", Controller })
                        + "?"
                        + string.Join("&", Params.Select(m => m.Key + "=" + m.Value).ToList());
                }

                return string.Join('/', new string[] { "api", Controller, Action })
                    + "?"
                    + string.Join("&", Params.Select(m => m.Key + "=" + m.Value).ToList());
            }
            return string.Join('/', new string[] { "api", Controller, Action });
        }
        private string convertUrlgetImage(string Controller, string Action, Dictionary<string, object> Params, string Id)
        {
            if (Params != null)
            {
                if (string.IsNullOrEmpty(Action))
                {
                    return string.Join('/', new string[] { "api", Controller })
                        + "?"
                        + string.Join("&", Params.Select(m => m.Key + "=" + m.Value).ToList());
                }

                return string.Join('/', new string[] { "api", Controller, Action, Id })
                    + "?"
                    + string.Join("&", Params.Select(m => m.Key + "=" + m.Value).ToList());
            }
            return string.Join('/', new string[] { "api", Controller, Action });
        }
        private string convertUrl(string Controller, string Action, string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return string.Join('/', new string[] { "api", Controller, Action });
            }
            if (string.IsNullOrEmpty(Action))
            {
                return string.Join('/', new string[] { "api", Controller, Id });
            }
            return string.Join('/', new string[] { "api", Controller, Action, Id });
        }

        private string convertParamToJsonString(Dictionary<string, object> Params)
        {
            return JsonConvert.SerializeObject(Params);
        }


        public string? Get(string Controller, string Action, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIGetConnect(convertUrl(Controller, Action, Params)).Result;
        }
        public string? Getlink(string Controller, string Action, Dictionary<string, object> Params, string Id)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIGetConnectlink(convertUrlgetImage(Controller, Action, Params, Id)).Result;
        }
        public string? Get(string Controller, string Action, string Id)
        {
            if (string.IsNullOrWhiteSpace(Controller) || string.IsNullOrWhiteSpace(Id))
            {
                return null;
            }
            return APIGetConnect(convertUrl(Controller, Action, Id)).Result;
        }
        public dynamic GetFile(string Controller, string Action, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIGetFileConnect(convertUrl(Controller, Action, Params)).Result;
        }
        public string Put(string Controller, string Action, string Id, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller) || string.IsNullOrWhiteSpace(Id))
            {
                return null;
            }

            return APIPutConnect(convertUrl(Controller, Action, string.Empty),
                new StringContent(convertParamToJsonString(Params), Encoding.UTF8, "application/json")).Result;
        }
        public string Post(string Controller, string Action, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }

            return APIPostConnect(convertUrl(Controller, Action, string.Empty),
                new StringContent(convertParamToJsonString(Params), Encoding.UTF8, "application/json")).Result;
        }
        public string PostL(string Controller, string Action, Dictionary<string, object> Params,string Token)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }

            return APIPostConnectL(convertUrl(Controller, Action, string.Empty),
                new StringContent(convertParamToJsonString(Params), Encoding.UTF8, "application/json"), Token).Result;
        }
        public string Post_string(string Controller, string Action, List<KeyValuePair<string, string>> list)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }

            return APIPostConnectString(convertUrl(Controller, Action, string.Empty), list).Result;
        }
        public string PostFormData(string Controller, string Action, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }

            return APIPostConnect(convertUrl(Controller, Action, string.Empty), Params).Result;
        }
        public string Post_File(string Controller, string Action, IFormFile file, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIPostConnect(convertUrl(Controller, Action, string.Empty),
               file, new StringContent(convertParamToJsonString(Params), Encoding.UTF8, "application/json")).Result;
        }
        public dynamic Post_File(string Controller, string Action, byte[] data, string filename, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIPostConnect_Dynamic(convertUrl(Controller, Action, string.Empty),
                   data, filename, Params).Result;
        }
        public string Post_File(string Controller, string Action, byte[] data, string filename, Dictionary<string, object> Params, bool ismetafile)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            if (ismetafile)
            {
                return APIPostConnect(convertUrl(Controller, Action, string.Empty),
               data, filename, new StringContent(convertParamToJsonString(Params), Encoding.UTF8, "application/json")).Result;
            }
            else
            {
                return APIPostConnect(convertUrl(Controller, Action, string.Empty),
                   data, filename, Params).Result;
            }
        }
        public dynamic Post_File(string Controller, string Action, List<byte[]> data, List<string> filenames)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIPostConnect(convertUrl(Controller, Action, string.Empty),
               data, filenames).Result;
        }
        public string Delete(string Controller, string Action, Dictionary<string, object> Params)
        {
            if (string.IsNullOrWhiteSpace(Controller))
            {
                return null;
            }
            return APIDeleteConnect(convertUrl(Controller, Action, Params)).Result;
        }
        public async Task<string> APIGetConnect(string pathUrl)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.            
                string? token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                var response = client.GetAsync(pathUrl).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }
        public async Task<string> APIGetConnectlink(string pathUrl)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.            
                string? token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                var response = client.GetAsync(pathUrl).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        public async Task<dynamic> APIGetFileConnect(string pathUrl)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.            
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                var response = client.GetAsync(pathUrl).Result;
                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return response;
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        public async Task<string> APIPutConnect(string pathUrl, StringContent content)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                var response = client.PutAsync(pathUrl, content).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        public async Task<string> APIPostConnect(string pathUrl, StringContent content)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                var response = client.PostAsync(pathUrl, content).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        public async Task<string> APIPostConnectL(string pathUrl, StringContent content,string Token)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                string token = Token;
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                var response = client.PostAsync(pathUrl, content).Result;
                client.Dispose();
                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        public async Task<string> APIPostConnectString(string pathUrl, List<KeyValuePair<string, string>> list)
        {

            //using (var httpClient = new HttpClient()
            //{

            //}
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                using (var content = new FormUrlEncodedContent(list))
                {
                    content.Headers.Clear();
                    content.Headers.Add("Content-Type", "application/x-www-form-urlencoded");

                    HttpResponseMessage response = await client.PostAsync(pathUrl, content);

                    //return await response.Content.ReadAsAsync<TResult>();                   

                    if (response != null)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                    }
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        public async Task<string> APIPostConnect(string pathUrl, IFormFile file, StringContent content)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(20);
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                byte[] data;
                using (var br = new BinaryReader(file.OpenReadStream()))
                    data = br.ReadBytes((int)file.OpenReadStream().Length);

                ByteArrayContent bytes = new ByteArrayContent(data);


                MultipartFormDataContent multiContent = new MultipartFormDataContent();

                multiContent.Add(bytes, "file", file.FileName);
                multiContent.Add(content, "metafile", "metafile.txt");


                var response = client.PostAsync(pathUrl, multiContent).Result;
                response.EnsureSuccessStatusCode();
                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }
        public async Task<string> APIPostConnect(string pathUrl, byte[] data, string filename, StringContent content)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                ByteArrayContent bytes = new ByteArrayContent(data);


                MultipartFormDataContent multiContent = new MultipartFormDataContent();

                multiContent.Add(bytes, "file", filename);
                multiContent.Add(content, "metafile", "metafile.txt");


                var response = client.PostAsync(pathUrl, multiContent).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }
        public async Task<string> APIPostConnect(string pathUrl, Dictionary<string, object> Params)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);


                MultipartFormDataContent multiContent = new MultipartFormDataContent();
                foreach (KeyValuePair<string, object> item in Params)
                {
                    multiContent.Add(new StringContent(item.Value.ToString()), item.Key);
                    multiContent.Add(new StringContent(item.Value.ToString()), item.Key);
                }


                var response = client.PostAsync(pathUrl, multiContent).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }

        public async Task<string> APIPostConnect(string pathUrl, byte[] data, string filename, Dictionary<string, object> Params)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = "";
                if (!string.IsNullOrEmpty(_clientIdApi) && !string.IsNullOrEmpty(_clientSecretApi))
                {
                    try
                    {
                        token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                    }
                    catch (Exception)
                    {

                    }
                }
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                }
                ByteArrayContent bytes = new ByteArrayContent(data);


                MultipartFormDataContent multiContent = new MultipartFormDataContent();

                multiContent.Add(bytes, "file", filename);
                foreach (KeyValuePair<string, object> item in Params)
                {
                    multiContent.Add(new StringContent(item.Value.ToString()), item.Key);
                    multiContent.Add(new StringContent(item.Value.ToString()), item.Key);
                }


                var response = client.PostAsync(pathUrl, multiContent).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }
        public async Task<dynamic> APIPostConnect_Dynamic(string pathUrl, byte[] data, string filename, Dictionary<string, object> Params)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                ByteArrayContent bytes = new ByteArrayContent(data);


                MultipartFormDataContent multiContent = new MultipartFormDataContent();

                multiContent.Add(bytes, "file", filename);
                foreach (KeyValuePair<string, object> item in Params)
                {
                    if (item.Value != null && item.Key != null)
                    {
                        multiContent.Add(new StringContent(item.Value.ToString()), item.Key);
                    }
                    //multiContent.Add(new StringContent(item.Value.ToString()), item.Key);
                }


                var response = client.PostAsync(pathUrl, multiContent).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return response;
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }
        public async Task<dynamic> APIPostConnect(string pathUrl, List<byte[]> data, List<string> filenames)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                MultipartFormDataContent multiContent = new MultipartFormDataContent();
                for (int i = 0; i < data.Count; i++)
                {
                    ByteArrayContent bytes = new ByteArrayContent(data[i]);
                    multiContent.Add(bytes, "file", filenames[i]);
                }
                var response = client.PostAsync(pathUrl, multiContent).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return response;
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }

            return null;
        }
        public async Task<string> APIDeleteConnect(string pathUrl)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_rootUrlApi);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
                // Add the Authorization header with the AccessToken.
                string token = await GetAccessToken(_clientIdApi, _clientSecretApi);
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                var response = client.DeleteAsync(pathUrl).Result;

                client.Dispose();

                if (response != null && response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    new WebLog().Write(string.Format("APIGetConnect -> response: {0} -> {1}", response.StatusCode, response.RequestMessage.RequestUri.ToString()));
                }
            }
            catch (Exception ex)
            {
                new WebLog().Write(string.Format("APIGetConnect -> catch: {0}{1} -> {2}", _rootUrlApi, pathUrl, ex.Message));
            }
            return null;
        }
        private async Task<string> GetAccessToken(string clientId, string clientSecret)
        {
            if (!string.IsNullOrEmpty(clientId) && !string.IsNullOrEmpty(clientSecret))
            {
                try
                {
                    var token = "";
                    return token;
                }
                catch
                {
                    return null;
                }

            }
            else
            {
                return null;
            }
        }
        //private async Task<string> GetAccessTokenLibrary(string clientId, string clientSecret)
        //{
        //    if (!string.IsNullOrEmpty(clientId) && !string.IsNullOrEmpty(clientSecret))
        //    {
        //        try
        //        {
        //            string pathUrl = convertUrl("auth", "token", string.Empty);
        //            using (var client = new HttpClient())
        //            {
        //                client.BaseAddress = new Uri(_rootUrlApi);

        //         //       // We want the response to be JSON.
        //         //       client.DefaultRequestHeaders.Accept.Clear();
        //         //       client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //         //       // Build up the data to POST.
        //         //       List<KeyValuePair<string, string>> postData = new List<KeyValuePair<string, string>>();
        //         //       //postData.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
        //         //       postData.Add(new KeyValuePair<string, string>("client_id", clientId));
        //         //       postData.Add(new KeyValuePair<string, string>("client_secret", clientSecret));

        //         //       //StringContent content = new StringContent("{\"client_id\":\""+clientId+"\",\"client_secret\":\""+ clientSecret + "\"}", Encoding.UTF8, "application/json");
        //         //       Dictionary<string, object> param = new Dictionary<string, object>
        //         //{
        //         //   {"client_id",clientId },
        //         //   {"client_secret",clientSecret}
        //         //};
        //         //       StringContent content = new StringContent(convertParamToJsonString(param), Encoding.UTF8, "application/json");

        //         //       // Post to the Server and parse the response.
        //         //       HttpResponseMessage response = await client.PostAsync(pathUrl, content);
        //         //       string jsonString = await response.Content.ReadAsStringAsync();
        //         //       object responseData = JsonConvert.DeserializeObject(jsonString);


        //                //using (var content = new FormUrlEncodedContent(list))
        //                //{
        //                //    content.Headers.Clear();
        //                //    content.Headers.Add("Content-Type", "application/x-www-form-urlencoded");

        //                //    HttpResponseMessage response = await client.PostAsync(pathUrl, content);

        //                //    //return await response.Content.ReadAsAsync<TResult>();                   

        //                //    if (response != null)
        //                //    {
        //                //        return await response.Content.ReadAsStringAsync();
        //                //    }
        //                //    return null;
        //                //}
        //                //// return the Access Token.
        //                //return ((dynamic)responseData).access_token;
        //            }
        //        }
        //        catch
        //        {
        //            return null;
        //        }

        //    }
        //    else
        //    {
        //        return null;
        //    }
        //}
    }
}
namespace Application.Core
{
    public class Result<T>
    {   
        public T Value { get; set; }
        public bool IsSuccess { get; set; }        
        public string Error { get; set; }

        // Request doğru ise Değeri dön, Success=True
        public static Result<T> Success(T value) => new Result<T>{IsSuccess=true,Value=value};
        // Request yanlış ise hata mesajı dön, Success=false
        public static Result<T> Failure(string error)=> new Result<T>{IsSuccess=false,Error=error};
    }
}
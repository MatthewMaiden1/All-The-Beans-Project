namespace AllTheBean.Core.Models;

public class OrderFormModel
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;
    public string Email     { get; set; } = string.Empty;
    public string Phone     { get; set; } = string.Empty;
    public string BeanType  { get; set; } = string.Empty;
    public int    Quantity  { get; set; }
    public string Website   { get; set; } = string.Empty;
}

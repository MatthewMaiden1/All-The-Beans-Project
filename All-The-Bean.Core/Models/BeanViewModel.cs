namespace AllTheBean.Core.Models;

public class BeanViewModel
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Cost { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Colour { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public bool IsBeanOfTheDay { get; set; }

    public static BeanViewModel FromBean(Bean bean) => new()
    {
        Id            = bean.Id,
        Name          = bean.Name,
        Description   = bean.Description.Trim(),
        Cost          = bean.Cost,
        Image         = bean.Image,
        Colour        = bean.Colour,
        Country       = bean.Country,
        IsBeanOfTheDay = bean.IsBOTD,
    };
}

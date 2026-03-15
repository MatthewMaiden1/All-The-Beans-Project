using AllTheBean.Core.Models;
using AllTheBean.Core.Validation;

namespace AllTheBean.Core.Services;

public interface IFormService
{
    FormValidationResult ValidateOrderForm(OrderFormModel model);
}

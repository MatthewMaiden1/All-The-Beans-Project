using AllTheBean.Core.Models;
using AllTheBean.Core.Validation;

namespace AllTheBean.Core.Services;

public class FormService : IFormService
{
    public FormValidationResult ValidateOrderForm(OrderFormModel model) =>
        OrderFormValidator.Validate(model);
}

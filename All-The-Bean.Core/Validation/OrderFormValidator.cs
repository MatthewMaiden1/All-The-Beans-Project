using System.Text.RegularExpressions;
using AllTheBean.Core.Models;

namespace AllTheBean.Core.Validation;

public static class OrderFormValidator
{
    private static readonly Regex EmailPattern = new(
        @"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);

    private static readonly Regex PhonePattern = new(
        @"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$", RegexOptions.Compiled);

    public static FormValidationResult Validate(OrderFormModel model)
    {
        var result = new FormValidationResult();

        ValidateFirstName(model.FirstName, result);
        ValidateLastName(model.LastName, result);
        ValidateEmail(model.Email, result);
        ValidatePhone(model.Phone, result);
        ValidateAddress(model.Address, result);
        ValidateBeanType(model.BeanType, result);
        ValidateQuantity(model.Quantity, result);

        return result;
    }

    private static void ValidateFirstName(string value, FormValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(value))
            result.AddError("firstName", "First name is required");
        else if (value.Trim().Length < 2)
            result.AddError("firstName", "First name must be at least 2 characters");
    }

    private static void ValidateLastName(string value, FormValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(value))
            result.AddError("lastName", "Last name is required");
        else if (value.Trim().Length < 2)
            result.AddError("lastName", "Last name must be at least 2 characters");
    }

    private static void ValidateEmail(string value, FormValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(value))
            result.AddError("email", "Email is required");
        else if (!EmailPattern.IsMatch(value.Trim()))
            result.AddError("email", "Enter a valid email address");
    }

    private static void ValidatePhone(string value, FormValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(value))
            result.AddError("phone", "Phone number is required");
        else if (!PhonePattern.IsMatch(value.Trim().Replace(" ", "")))
            result.AddError("phone", "Enter a valid phone number");
    }

    private static void ValidateAddress(string value, FormValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(value))
            result.AddError("address", "Address is required");
        else if (value.Trim().Length < 5)
            result.AddError("address", "Enter a valid address");
    }

    private static void ValidateBeanType(string value, FormValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(value))
            result.AddError("beanType", "Please select a bean");
    }

    private static void ValidateQuantity(int value, FormValidationResult result)
    {
        if (value < 1 || value > 99)
            result.AddError("quantity", "Quantity must be between 1 and 99");
    }
}

namespace AllTheBean.Core.Validation;

public class FormValidationResult
{
    public bool IsValid => Errors.Count == 0;
    public Dictionary<string, string> Errors { get; } = [];

    public void AddError(string field, string message) =>
        Errors.TryAdd(field, message);
}

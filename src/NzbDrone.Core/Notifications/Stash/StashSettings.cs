using FluentValidation;
using Newtonsoft.Json;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Annotations;
using NzbDrone.Core.ThingiProvider;
using NzbDrone.Core.Validation;

namespace NzbDrone.Core.Notifications.Stash
{
    public class StashSettingsValidator : AbstractValidator<StashSettings>
    {
        public StashSettingsValidator()
        {
            RuleFor(c => c.Host).ValidHost();
            RuleFor(c => c.Port).ValidPort();
            RuleFor(c => c.MapFrom).NotEmpty().Unless(c => c.MapTo.IsNullOrWhiteSpace());
            RuleFor(c => c.MapTo).NotEmpty().Unless(c => c.MapFrom.IsNullOrWhiteSpace());
            RuleFor(c => c.GenerateImagePreviews)
                .Equal(false)
                .Unless(c => c.GeneratePreviews)
                .WithMessage("Generate Previews must also be enabled");
        }
    }

    public class StashSettings : IProviderConfig
    {
        private static readonly StashSettingsValidator Validator = new StashSettingsValidator();

        public StashSettings()
        {
            Port = 9998;
        }

        [FieldDefinition(0, Label = "Host")]
        public string Host { get; set; }

        [FieldDefinition(1, Label = "Port")]
        public int Port { get; set; }

        [FieldDefinition(2, Label = "Use SSL", Type = FieldType.Checkbox, HelpText = "Connect to Stash over HTTPS instead of HTTP")]
        public bool UseSsl { get; set; }

        [FieldDefinition(3, Label = "API Key", Privacy = PrivacyLevel.ApiKey)]
        public string ApiKey { get; set; }

        [FieldDefinition(4, Label = "Scan: Generate Covers", HelpText = "Generate covers for new media during scan", Type = FieldType.Checkbox)]
        public bool GenerateCovers { get; set; }

        [FieldDefinition(5, Label = "Scan: Generate Previews", HelpText = "Generate previews for new media during scan", Type = FieldType.Checkbox)]
        public bool GeneratePreviews { get; set; }

        [FieldDefinition(6, Label = "Scan: Generate Image Previews", HelpText = "Generate image previews for new media during scan", Type = FieldType.Checkbox)]
        public bool GenerateImagePreviews { get; set; }

        [FieldDefinition(7, Label = "Scan: Generate Sprites", HelpText = "Generate sprites for new media during scan", Type = FieldType.Checkbox)]
        public bool GenerateSprites { get; set; }

        [FieldDefinition(8, Label = "Scan: Generate Phashes", HelpText = "Generate phash for new media during scan", Type = FieldType.Checkbox)]
        public bool GeneratePhashes { get; set; }

        [FieldDefinition(9, Label = "Run Identify Task", HelpText = "Run Metadata Identify task on new files", Type = FieldType.Checkbox)]
        public bool MetadataIdentify { get; set; }

        [FieldDefinition(10, Label = "Identify: Include Male Performers", HelpText = "Include Male Performers during Identify task", Type = FieldType.Checkbox)]
        public bool IncludeMalePerformers { get; set; }

        [FieldDefinition(11, Label = "Identify: Set Organized", HelpText = "Use Set Organized during Identify task", Type = FieldType.Checkbox)]
        public bool SetOrganized { get; set; }

        [FieldDefinition(12, Label = "Map Paths From", Type = FieldType.Textbox, Advanced = true, HelpText = "Whisparr Path, Used to modify site paths when Stash sees library path location differently from Whisparr")]
        public string MapFrom { get; set; }

        [FieldDefinition(13, Label = "Map Paths To", Type = FieldType.Textbox, Advanced = true, HelpText = "Stash Path, Used to modify site paths when Stash sees library path location differently from Whisparr")]
        public string MapTo { get; set; }

        [JsonIgnore]
        public string Address => $"{Host.ToUrlHost()}:{Port}";

        public bool IsValid => !string.IsNullOrWhiteSpace(Host) && Port > 0;

        public NzbDroneValidationResult Validate()
        {
            return new NzbDroneValidationResult(Validator.Validate(this));
        }
    }
}

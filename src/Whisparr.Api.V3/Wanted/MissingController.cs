using Microsoft.AspNetCore.Mvc;
using NzbDrone.Core.CustomFormats;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.DecisionEngine.Specifications;
using NzbDrone.Core.Tv;
using NzbDrone.SignalR;
using Whisparr.Api.V3.Episodes;
using Whisparr.Http;
using Whisparr.Http.Extensions;

namespace Whisparr.Api.V3.Wanted
{
    [V3ApiController("wanted/missing")]
    public class MissingController : EpisodeControllerWithSignalR
    {
        public MissingController(IEpisodeService episodeService,
                             ISeriesService seriesService,
                             IUpgradableSpecification upgradableSpecification,
                             ICustomFormatCalculationService formatCalculator,
                             IBroadcastSignalRMessage signalRBroadcaster)
            : base(episodeService, seriesService, upgradableSpecification, formatCalculator, signalRBroadcaster)
        {
        }

        [HttpGet]
        [Produces("application/json")]
        public PagingResource<EpisodeResource> GetMissingEpisodes([FromQuery] PagingRequestResource paging, bool includeSeries = false, bool includeImages = false, bool monitored = true)
        {
            var pagingResource = new PagingResource<EpisodeResource>(paging);
            var pagingSpec = new PagingSpec<Episode>
            {
                Page = pagingResource.Page,
                PageSize = pagingResource.PageSize,
                SortKey = pagingResource.SortKey,
                SortDirection = pagingResource.SortDirection
            };

            pagingSpec.FilterExpressions.Add(v => v.Monitored == monitored || v.Series.Monitored == monitored);

            var resource = pagingSpec.ApplyToPage(_episodeService.EpisodesWithoutFiles, v => MapToResource(v, includeSeries, false, includeImages));

            return resource;
        }
    }
}

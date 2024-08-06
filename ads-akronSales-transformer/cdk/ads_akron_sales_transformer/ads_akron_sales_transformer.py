from aws_cdk import (
    Stack    
)

from constructs import Construct
from signet_cdk_common_constructs import ESIIntegrationBase

class AdsAkronSalesTransformerStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        esiBase =  ESIIntegrationBase(self, 'esi-ads-akron-sales-transformer')

        lambdaFn = esiBase.create_cloud_map_lambda("lambdaConfig")
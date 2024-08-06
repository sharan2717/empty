#!/usr/bin/env python3
import os

import aws_cdk as cdk

from ads_akron_sales_transformer.ads_akron_sales_transformer import AdsAkronSalesTransformerStack


app = cdk.App()
env = app.node.try_get_context("env")
aws_account = app.node.try_get_context(env)["account"]
print(aws_account)
aws_env = cdk.Environment(account=aws_account, region=app.node.try_get_context(env)["region"])

app_name = app.node.try_get_context(env)["appName"]
app_prefix = app.node.try_get_context(env)["appPrefix"]

stack_name = app_name + "-stack"
print(f"STACK Name[{stack_name}] env[{env}]")

AdsAkronSalesTransformerStack(app, stack_name, env=aws_env)

app.synth()
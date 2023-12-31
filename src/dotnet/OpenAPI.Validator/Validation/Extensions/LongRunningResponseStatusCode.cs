﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Linq;
using AutoRest.Core.Logging;
using OpenAPI.Validator.Model;
using OpenAPI.Validator.Properties;
using OpenAPI.Validator.Validation.Core;

namespace OpenAPI.Validator.Validation.Extensions
{
    public class LongRunningResponseStatusCode : ExtensionRule
    {
        private static readonly IEnumerable<string> DeleteAllowedCodes = new List<string>() { "200", "204" };
        private static readonly IEnumerable<string> DeleteAllowedCodesOfDataPlane = new List<string>() { "200", "204","202" };
        private static readonly IEnumerable<string> PostAllowedCodes = new List<string>() { "200", "201", "202", "204" };
        private static readonly IEnumerable<string> PutAllowedCodes = new List<string>() { "200", "201"};
        private static readonly IEnumerable<string> PutAllowedCodesDataPlane = new List<string>() { "200", "201", "202" };
        private static readonly IEnumerable<string> PatchAllowedCodes = new List<string>() { "200", "201", "202" };
        protected override string ExtensionName => "x-ms-long-running-operation";

        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R2005";

        /// <summary>
        /// Violation category of the Rule.
        /// </summary>
        public override ValidationCategory ValidationCategory => ValidationCategory.SDKViolation;

        /// <summary>
        /// The severity of this message (ie, debug/info/warning/error/fatal, etc)
        /// </summary>
        public override Category Severity => Category.Error;

        /// <summary>
        /// The template message for this Rule.
        /// </summary>
        public override string MessageTemplate => Resources.LongRunningResponseNotValid;

        protected static bool AreValidResponseCodes(RuleContext context, IEnumerable<string> statusCodes)
            => statusCodes.Any(statusCode => context?.GetFirstAncestor<Operation>()?.Responses?.GetValueOrNull(statusCode) != null);

        /// <summary>
        /// Returns http verb for the given Rule context.
        /// </summary>
        /// <param name="context">Rule context.</param>
        /// <returns>http verb as string</returns>
        protected static string GetHttpVerb(RuleContext context) => context?.Parent?.Parent?.Key;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM | ServiceDefinitionDocumentType.DataPlane;

        /// <summary>
        /// The rule runs on each operation in isolation irrespective of the state and can be run in individual state
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Individual;

        /// <summary>
        /// An x-ms-long-running-operation extension passes this rule if the operation that this extension has a valid response defined.
        /// </summary>
        /// <param name="longRunning">long running extension object.</param>
        /// <param name="context">Rule context.</param>
        /// <param name="formatParameters">list of parameters for message formatter.</param>
        /// <returns><c>true</c> if operation has valid response code modeled, otherwise <c>false</c>.</returns>
        /// <remarks>This rule corresponds to M2005.</remarks>
        public override bool IsValid(object longRunning, RuleContext context, out object[] formatParameters)
        {
            bool isValid = true;
            var operation = context?.GetFirstAncestor<Operation>();
            formatParameters = new string[3];
            string httpVerb = GetHttpVerb(context);

            if ("delete".EqualsIgnoreCase(httpVerb))
            {
                if (context.Meta.ServiceDefinitionDocumentType == ServiceDefinitionDocumentType.DataPlane)
                {
                    isValid = AreValidResponseCodes(context, DeleteAllowedCodesOfDataPlane);
                    formatParameters[2] = string.Join(" or ", DeleteAllowedCodesOfDataPlane);
                }
                else
                {
                    isValid = AreValidResponseCodes(context, DeleteAllowedCodes);
                    formatParameters[2] = string.Join(" or ", DeleteAllowedCodes);
                }
               
            }
            else if ("post".EqualsIgnoreCase(httpVerb))
            {
                isValid = AreValidResponseCodes(context, PostAllowedCodes);
                formatParameters[2] = string.Join(" or ", PostAllowedCodes);
            }
            else if ("put".EqualsIgnoreCase(httpVerb) )
            {
                if (context.Meta.ServiceDefinitionDocumentType == ServiceDefinitionDocumentType.DataPlane)
                {
                    isValid = AreValidResponseCodes(context, PutAllowedCodesDataPlane);
                    formatParameters[2] = string.Join(" or ", PutAllowedCodesDataPlane);
                }
                else
                {
                    isValid = AreValidResponseCodes(context, PutAllowedCodes);
                    formatParameters[2] = string.Join(" or ", PutAllowedCodes);
                }
            }
            else if ("patch".EqualsIgnoreCase(httpVerb)) {
                isValid = AreValidResponseCodes(context, PatchAllowedCodes);
                formatParameters[2] = string.Join(" or ", PatchAllowedCodes);
            }

            formatParameters[0] = httpVerb.ToUpper();
            formatParameters[1] = operation.OperationId ?? string.Empty;
            return isValid;
        }
    }
}

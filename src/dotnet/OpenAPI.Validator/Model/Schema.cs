﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using AutoRest.Core.Model;
using OpenAPI.Validator.Validation;
using OpenAPI.Validator.Validation.Core;
using OpenAPI.Validator.Validation.Extensions;
using System.Collections.Generic;

namespace OpenAPI.Validator.Model
{
    /// <summary>
    /// Swagger schema object.
    /// </summary>
    public class Schema : SwaggerObject
    {
        public string Title { get; set; }

        /// <summary>
        /// Adds support for polymorphism. The discriminator is the schema 
        /// property serviceTypeName that is used to differentiate between other schemas 
        /// that inherit this schema. The property serviceTypeName used MUST be defined 
        /// at this schema and it MUST be in the required property list. When used, 
        /// the value MUST be the serviceTypeName of this schema or any schema that inherits it,
        /// or it can be overridden with the x-ms-discriminator-value extension.
        /// </summary>
        public string Discriminator { get; set; }

        /// <summary>
        /// Key is a type serviceTypeName.
        /// </summary>
        [CollectionRule(typeof(AvoidNestedProperties))]
        [Rule(typeof(XmsClientNameProperty))]
        [Rule(typeof(DescriptionAndTitleMissing))]
        [CollectionRule(typeof(RequiredReadOnlyProperties))]
        public Dictionary<string, Schema> Properties { get; set; }

        public bool ReadOnly { get; set; }

        public ExternalDoc ExternalDocs { get; set; }

        public object Example { get; set; }

        /// <summary>
        /// The value of this property MUST be another schema which will provide 
        /// a base schema which the current schema will inherit from.  The
        /// inheritance rules are such that any instance that is valid according
        /// to the current schema MUST be valid according to the referenced
        /// schema.  This MAY also be an array, in which case, the instance MUST
        /// be valid for all the schemas in the array.  A schema that extends
        /// another schema MAY define additional attributes, constrain existing
        /// attributes, or add other constraints.
        /// </summary>
        public string Extends { get; set; }

        //For now (till the PBI gets addressed for the refactoring work), a generic field is used
        //for the reason that SwaggerParameter inherits from this class, but per spec, it's 'IsRequired' 
        //field should be boolean, not an array.
        public IList<string> Required { get; set; }

        /// <summary>
        /// Defines the set of schemas this shema is composed of
        /// </summary>
        [CollectionRule(typeof(AvoidAnonymousTypes))]
        public IList<Schema> AllOf { get; set; }

        /// <summary>
        /// A metadata object that allows for more fine-tuned XML model definitions.
        /// </summary>
        public XmlProperties Xml { get; set; }

        public static Schema FindReferencedSchema(string reference, IDictionary<string, Schema> definitions)
        {
            if (reference != null && reference.StartsWith("#", StringComparison.Ordinal))
            {
                var parts = reference.Split('/');
                if (parts.Length == 3 && parts[1].Equals("definitions"))
                {
                    Schema p;
                    if (definitions.TryGetValue(parts[2], out p))
                    {
                        return p;
                    }
                }
            }

            return null;
        }
    }
}